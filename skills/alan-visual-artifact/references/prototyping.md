# Bounded Prototyping

Use a prototype when the unresolved question is behavioral: whether one
important path, transition, recovery, or responsive interaction works. It is a
throwaway decision artifact, not a production implementation.

## Define the boundary

Record the user, decision, starting state, successful end state, relevant
failure, recovery action, representative content, and behaviors deliberately
excluded. Put a visible `Simulated boundary` note in the artifact. State that no
backend, authentication, persistence, permission enforcement, or production
side effect exists unless the parent supplies a real safe integration.

## State envelope

Include only states that change the decision, normally:

- initial or empty;
- loading or in progress;
- success;
- failure;
- recovery or retry.

Every rendered control must work. Prefer deterministic buttons that move
between pre-authored states over timers or fake network activity. Show the
transition map in static content so the full behavior remains inspectable when
JavaScript is unavailable and in print.

## Presentation

Use representative content and the fixed editorial artifact tokens. The
artifact may resemble the shape of an interface, but it must not impersonate
Alan's production UI or import Electron/product tokens. Keep one organizing
idea, one primary action per state, and only the controls needed to answer the
question.

## Verification

Exercise the happy path, failure path, retry, reset, keyboard operation, narrow
layout, reduced motion, and print. Confirm that controls never invoke network,
storage, forms, downloads, popups, or parent navigation.

Start from [templates/prototype.html](../templates/prototype.html) when a
behavioral artifact wins. Run the `prototype` certificate profile.
