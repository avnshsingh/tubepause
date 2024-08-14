import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import {
  CircleUserRound,
  Github,
  Link,
  Linkedin,
  MailPlus,
  X,
} from "lucide-react";

function App() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get("autoPlayEnabled", result => {
      setIsEnabled(result.autoPlayEnabled ?? true);
    });
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    chrome.storage.sync.set({ autoPlayEnabled: newState });
    chrome.tabs.query({ url: "*://www.youtube.com/*" }, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id!, {
          action: "toggleAutoPlay",
          value: newState,
        });
      });
    });
  };
  return (
    <div className="h-[250px] w-[200px] bg-orange-100">
      <div className="flex items-center justify-center pt-6">
        <Button
          onClick={handleToggle}
          className="bg-orange-800 hover:bg-orange-950"
        >
          {isEnabled ? "Disable Auto Play/Pause" : "Enable Auto Play/Pause"}
        </Button>
      </div>
      <h2 className="text-lg font-medium text-center py-2 text-orange-950">
        Check me out!
      </h2>
      <div className="grid grid-cols-2 place-items-center gap-2">
        <a
          href="https://www.avinashs.in/"
          target="_blank"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800"
        >
          <CircleUserRound size={20} strokeWidth={1} />
          Portfolio
        </a>
        <a
          href="https://www.avinashs.in/posts/"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800 px-3"
          target="_blank"
        >
          <Link size={20} strokeWidth={1} />
          Blog
        </a>
        <a
          href="https://www.linkedin.com/in/avnshsingh/"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800"
          target="_blank"
        >
          <Linkedin size={20} strokeWidth={1} />
          Linkedin
        </a>
        <a
          href="https://x.com/avnshSingh"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800"
          target="_blank"
        >
          <X size={20} strokeWidth={1} />
          Twitter
        </a>
        <a
          href="https://github.com/avnshsingh"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800 px-2"
          target="_blank"
        >
          <Github size={20} strokeWidth={1} />
          Github
        </a>
        <a
          href="mailto:avinashsingh888555@gmail.com"
          className="flex gap-1 items-center border-2 border-orange-400 rounded-md p-1 hover:bg-orange-200 text-orange-800 px-2"
        >
          <MailPlus size={20} strokeWidth={1} />
          Email
        </a>
      </div>
    </div>
  );
}

export default App;
