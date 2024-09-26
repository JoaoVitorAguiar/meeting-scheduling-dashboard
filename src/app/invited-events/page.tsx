// pages/invited-events.tsx
import EventsPage from "@/components/EventsPage";

export default function InvitedEventsPage() {
  return <EventsPage apiEndpoint="/meeting/invited-meetings" />;
}
