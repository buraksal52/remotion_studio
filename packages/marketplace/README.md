# `@motion-studio/marketplace`

The marketplace package owns the local catalog and installed-plugin state
contract. It supports deterministic discovery, compatibility filtering, and
install/update/remove lifecycle operations.

This phase deliberately does not download or execute native plugin code. A
future remote marketplace can provide signed packages and a trusted install
adapter without changing this catalog/state contract.
