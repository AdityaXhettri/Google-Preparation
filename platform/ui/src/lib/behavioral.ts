export type BehavioralQuestion = {
  id: string;
  attribute: "ambiguity" | "feedback" | "status-quo" | "user-first" | "right-thing" | "team";
  question: string;
};

export const BEHAVIORAL: BehavioralQuestion[] = [
  { id: "b-amb-1", attribute: "ambiguity", question: "Tell me about a time you had to figure out what to build with minimal direction." },
  { id: "b-amb-2", attribute: "ambiguity", question: "Describe a project where requirements kept changing. How did you handle it?" },
  { id: "b-amb-3", attribute: "ambiguity", question: "Tell me about a time you had to make a decision without all the information." },
  { id: "b-amb-4", attribute: "ambiguity", question: "Give me an example of a problem you defined yourself rather than being assigned." },
  { id: "b-fb-1", attribute: "feedback", question: "Tell me about a time you received tough feedback. What did you do?" },
  { id: "b-fb-2", attribute: "feedback", question: "Describe a time you changed your approach based on someone else's input." },
  { id: "b-fb-3", attribute: "feedback", question: "Tell me about a code review that significantly changed your work." },
  { id: "b-fb-4", attribute: "feedback", question: "When was the last time you asked for feedback proactively?" },
  { id: "b-sq-1", attribute: "status-quo", question: "Tell me about a time you challenged the way something was done." },
  { id: "b-sq-2", attribute: "status-quo", question: "Describe a situation where you pushed back on a decision." },
  { id: "b-sq-3", attribute: "status-quo", question: "Tell me about a time you influenced without authority." },
  { id: "b-sq-4", attribute: "status-quo", question: "Give me an example of when your idea replaced an existing process." },
  { id: "b-uf-1", attribute: "user-first", question: "Tell me about a time you prioritized user needs over business goals." },
  { id: "b-uf-2", attribute: "user-first", question: "Describe when you made a decision that improved user experience but was harder." },
  { id: "b-uf-3", attribute: "user-first", question: "Tell me about a time you went above and beyond for a customer." },
  { id: "b-rt-1", attribute: "right-thing", question: "Tell me about a time you did the right thing even when it was unpopular." },
  { id: "b-rt-2", attribute: "right-thing", question: "Describe a moment you had to be honest about bad news." },
  { id: "b-rt-3", attribute: "right-thing", question: "Tell me about a time you raised a concern others didn't want to hear." },
  { id: "b-rt-4", attribute: "right-thing", question: "Give me an example of when you chose reliability over shipping fast." },
  { id: "b-tm-1", attribute: "team", question: "Tell me about a time you helped a teammate succeed." },
  { id: "b-tm-2", attribute: "team", question: "Describe a time you onboarded or mentored someone." },
  { id: "b-tm-3", attribute: "team", question: "Tell me about a conflict on your team and how you resolved it." },
  { id: "b-tm-4", attribute: "team", question: "Give me an example of when you improved your team's process." },
];

export const ATTRIBUTE_LABELS: Record<BehavioralQuestion["attribute"], string> = {
  ambiguity: "Thriving in Ambiguity",
  feedback: "Valuing Feedback",
  "status-quo": "Challenging Status Quo",
  "user-first": "Putting User First",
  "right-thing": "Doing the Right Thing",
  team: "Caring About Team",
};

export function randomBehavioral(): BehavioralQuestion {
  return BEHAVIORAL[Math.floor(Math.random() * BEHAVIORAL.length)];
}