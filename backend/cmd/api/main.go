package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	StatusDraft         Status = "draft"
	StatusPendingReview Status = "pending_review"
	StatusNeedsInfo     Status = "needs_more_info"
	StatusRejected      Status = "rejected"
	StatusPublished     Status = "published"
	StatusBlocked       Status = "blocked"
)

type User struct {
	ID                 string    `json:"id"`
	Mobile             string    `json:"mobile"`
	FullName           string    `json:"fullName"`
	NationalIDMasked   string    `json:"nationalIdMasked"`
	IdentityStatus     Status    `json:"identityStatus"`
	RiskStatus         string    `json:"riskStatus"`
	CreatedAt          time.Time `json:"createdAt"`
}

type Listing struct {
	ID              string    `json:"id"`
	OwnerID         string    `json:"ownerId"`
	Type            string    `json:"type"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	City            string    `json:"city"`
	Neighborhood    string    `json:"neighborhood"`
	Area            int       `json:"area"`
	Rooms           int       `json:"rooms"`
	Price           int64     `json:"price"`
	Deposit         int64     `json:"deposit"`
	MonthlyRent     int64     `json:"monthlyRent"`
	Lat             float64   `json:"lat"`
	Lng             float64   `json:"lng"`
	Status          Status    `json:"status"`
	TrustBadges     []string  `json:"trustBadges"`
	RiskFlags       []string  `json:"riskFlags,omitempty"`
	AdminNote       string    `json:"adminNote,omitempty"`
	CreatedAt       time.Time `json:"createdAt"`
}

type ReviewDecision struct {
	Decision string `json:"decision"`
	Reason   string `json:"reason"`
	AdminID  string `json:"adminId"`
}

type Store struct {
	users    map[string]User
	listings map[string]Listing
	audit    []string
}

func main() {
	store := &Store{users: map[string]User{}, listings: map[string]Listing{}, audit: []string{}}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", jsonHandler(health))
	mux.HandleFunc("POST /api/v1/auth/otp/request", jsonHandler(requestOTP))
	mux.HandleFunc("POST /api/v1/auth/otp/verify", jsonHandler(func(w http.ResponseWriter, r *http.Request) { verifyOTP(store, w, r) }))
	mux.HandleFunc("POST /api/v1/listings", jsonHandler(func(w http.ResponseWriter, r *http.Request) { createListing(store, w, r) }))
	mux.HandleFunc("GET /api/v1/listings", jsonHandler(func(w http.ResponseWriter, r *http.Request) { listPublished(store, w, r) }))
	mux.HandleFunc("POST /api/v1/admin/listings/", jsonHandler(func(w http.ResponseWriter, r *http.Request) { reviewListing(store, w, r) }))
	mux.HandleFunc("GET /api/v1/admin/review-queue", jsonHandler(func(w http.ResponseWriter, r *http.Request) { reviewQueue(store, w, r) }))

	addr := env("HTTP_ADDR", ":8080")
	log.Printf("verified property backend listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, logging(cors(mux))))
}

func health(w http.ResponseWriter, r *http.Request) { writeJSON(w, http.StatusOK, map[string]any{"status": "ok"}) }

func requestOTP(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusAccepted, map[string]any{"message": "OTP generated for local development. Integrate SMS provider in production."})
}

func verifyOTP(s *Store, w http.ResponseWriter, r *http.Request) {
	var req struct{ Mobile, FullName, NationalID string }
	mustDecode(r, &req)
	if req.Mobile == "" { http.Error(w, "mobile is required", http.StatusBadRequest); return }
	id := uuid.NewString()
	s.users[id] = User{ID: id, Mobile: req.Mobile, FullName: req.FullName, NationalIDMasked: mask(req.NationalID), IdentityStatus: StatusPendingReview, RiskStatus: "normal", CreatedAt: time.Now()}
	writeJSON(w, http.StatusOK, map[string]any{"token": "local-dev-token", "user": s.users[id]})
}

func createListing(s *Store, w http.ResponseWriter, r *http.Request) {
	var l Listing
	mustDecode(r, &l)
	if l.OwnerID == "" || l.Title == "" || l.City == "" || l.Area <= 0 { http.Error(w, "ownerId, title, city and area are required", http.StatusBadRequest); return }
	l.ID = uuid.NewString(); l.Status = StatusPendingReview; l.CreatedAt = time.Now(); l.RiskFlags = assessRisk(l)
	s.listings[l.ID] = l
	s.audit = append(s.audit, "listing_submitted:"+l.ID)
	writeJSON(w, http.StatusCreated, l)
}

func listPublished(s *Store, w http.ResponseWriter, r *http.Request) {
	items := []Listing{}
	for _, l := range s.listings { if l.Status == StatusPublished { l.AdminNote = ""; l.RiskFlags = nil; items = append(items, l) } }
	writeJSON(w, http.StatusOK, items)
}

func reviewQueue(s *Store, w http.ResponseWriter, r *http.Request) {
	items := []Listing{}
	for _, l := range s.listings { if l.Status == StatusPendingReview || l.Status == StatusNeedsInfo { items = append(items, l) } }
	writeJSON(w, http.StatusOK, items)
}

func reviewListing(s *Store, w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/admin/listings/")
	id = strings.TrimSuffix(id, "/review")
	l, ok := s.listings[id]; if !ok { http.NotFound(w, r); return }
	var d ReviewDecision; mustDecode(r, &d)
	if d.Reason == "" { http.Error(w, "manual review reason is required", http.StatusBadRequest); return }
	switch d.Decision { case "approve": l.Status = StatusPublished; l.TrustBadges = []string{"verified_owner", "manual_document_review", "price_checked", "direct_owner"}; case "reject": l.Status = StatusRejected; case "needs_more_info": l.Status = StatusNeedsInfo; case "block": l.Status = StatusBlocked; default: http.Error(w, "invalid decision", http.StatusBadRequest); return }
	l.AdminNote = d.Reason; s.listings[id] = l; s.audit = append(s.audit, "manual_review:"+id+":"+d.Decision)
	writeJSON(w, http.StatusOK, l)
}

func assessRisk(l Listing) []string { flags := []string{}; if l.Price > 0 && l.Area > 0 && l.Price/int64(l.Area) > 1000000000 { flags = append(flags, "extreme_price_per_meter") }; if l.Lat == 0 || l.Lng == 0 { flags = append(flags, "missing_precise_location") }; return flags }
func jsonHandler(fn http.HandlerFunc) http.HandlerFunc { return func(w http.ResponseWriter, r *http.Request) { w.Header().Set("Content-Type", "application/json"); fn(w, r) } }
func writeJSON(w http.ResponseWriter, status int, v any) { w.WriteHeader(status); _ = json.NewEncoder(w).Encode(v) }
func mustDecode(r *http.Request, v any) { _ = json.NewDecoder(r.Body).Decode(v) }
func env(k, d string) string { if v := os.Getenv(k); v != "" { return v }; return d }
func mask(v string) string { if len(v) < 4 { return "****" }; return strings.Repeat("*", len(v)-4)+v[len(v)-4:] }
func cors(next http.Handler) http.Handler { return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Header().Set("Access-Control-Allow-Origin", "*"); w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization"); w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); if r.Method == http.MethodOptions { return }; next.ServeHTTP(w, r) }) }
func logging(next http.Handler) http.Handler { return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { log.Printf("%s %s", r.Method, r.URL.Path); next.ServeHTTP(w, r) }) }
