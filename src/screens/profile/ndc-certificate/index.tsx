import ServiceRequestScreen from "@components/service-request";
import { SUPPORT_CONTACTS } from "@shared/contact-details";

export default function NdcCertificateScreen() {
  return (
    <ServiceRequestScreen
      namespace="serviceRequests.ndc_certificate"
      listBlocks={["eligibility", "required_details"]}
      contacts={SUPPORT_CONTACTS}
    />
  );
}
