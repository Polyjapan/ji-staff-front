import {Application} from "../services/backend.service";

export function getStateLabel(application: Application): string {
  if (application.isAccepted) {
    return "label-success";
  } if (application.isRefused) {
    return "label-danger";
  } else if (application.isValidated) {
    return "label-warning";
  }
  return "label-danger";
}

export function getState(application: Application): string {
  if (application.isAccepted) {
    return "accepted";
  } else if (application.isRefused) {
    return "refused";
  } else if (application.isValidated) {
    return "waiting";
  }
  return null;
}

export function getStateFancy(application: Application): string {
  if (application.isAccepted) {
    return "Acceptée";
  } else if (application.isRefused) {
    return "Refusée";
  } else if (application.isValidated) {
    return "En attente";
  }
  return "Non envoyée";
}
