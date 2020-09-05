package helloworld

import (
    "io/ioutil"
    "net/http/httptest"
    "strings"
    "testing"
)

func TestHelloGet(t *testing.T) {
    payload := strings.NewReader("")
    req := httptest.NewRequest("GET", "/", payload)

    rr := httptest.NewRecorder()
    HelloGet(rr, req)

    out, err := ioutil.ReadAll(rr.Result().Body)
    if err != nil {
        t.Fatalf("ReadAll: %v", err)
    }
    want := "Hello, World!"
    if got := string(out); got != want {
        t.Errorf("HelloWorld = %q, want %q", got, want)
    }
}