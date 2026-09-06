package main

import "testing"

func TestRunNode(t *testing.T) {
	if code := runNode([]string{"-e", "process.exit(0)"}); code != exitSuccess {
		t.Fatalf("expected Node process to exit successfully, got code %d", code)
	}
}

func TestValidProjectName(t *testing.T) {
	for _, name := range []string{"demo", "technical-explainer"} {
		if !validProjectName(name) {
			t.Fatalf("expected %q to be valid", name)
		}
	}
	for _, name := range []string{"", ".", "..", "../outside", "nested/project"} {
		if validProjectName(name) {
			t.Fatalf("expected %q to be invalid", name)
		}
	}
}

func TestMarketplaceCommandMapping(t *testing.T) {
	if code := marketplaceCommand(".", []string{"unknown"}, true); code != exitRuntime {
		t.Fatalf("expected unknown plugin action to fail")
	}
}
