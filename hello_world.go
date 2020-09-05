// Package helloworld provides a set of Cloud Function samples.
package helloworld

import (
    "fmt"
    "net/http"
)

// HelloGet is an HTTP Cloud Function.
func HelloGet(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, World!")
}