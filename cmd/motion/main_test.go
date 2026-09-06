package main

import "testing"

func TestRunNode(t *testing.T) {
	if err := runNode([]string{"-e", "process.exit(0)"}); err != nil {
		t.Fatalf("expected Node process to exit successfully: %v", err)
	}
}
