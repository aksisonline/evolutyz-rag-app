import { Chat as PreviewChat } from "@/components/chat";
import { generateId } from "ai";

export default function Page({ params }: { params: any }) {
  const { id } = params;
  
  return (
    <PreviewChat
      id={id || generateId()}
      initialMessages={[]}
      session={null}
    />
  );
}
