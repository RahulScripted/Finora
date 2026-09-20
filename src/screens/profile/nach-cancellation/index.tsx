import ServiceRequestScreen from "@components/service-request";
import { SUPPORT_CONTACTS } from "@shared/contact-details";

export default function NachCancellationScreen() {
  return (
    <ServiceRequestScreen
      namespace="serviceRequests.nach_cancellation"
      listBlocks={["required_details"]}
      contacts={SUPPORT_CONTACTS}
    />
  );
}
