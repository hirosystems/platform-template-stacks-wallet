(define-data-var count uint u0)

(define-public (increment) 
  (ok (var-set count (+ (var-get count) u1)))
)

(define-read-only (get-count)
  (var-get count)
)