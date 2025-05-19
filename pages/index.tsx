import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KokkehjelperDemo() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleChat = async () => {
    if (chatInput.trim()) {
      const userMessage = { sender: "Du", text: chatInput.trim() };
      setChatLog((prev) => [...prev, userMessage]);
      setChatInput("");
      setLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: chatInput, ingredients })
        });
        const data = await response.json();
        setChatLog((prev) => [...prev, { sender: "Kokkehjelperen", text: data.reply }]);
      } catch (error) {
        setChatLog((prev) => [...prev, { sender: "Kokkehjelperen", text: "Noe gikk galt. Prøv igjen senere." }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🍳 Kokkehjelper-demo</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold">1. Ingredienser du har</h2>
          <div className="flex gap-2">
            <Input
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              placeholder="F.eks. potet, gulrot..."
            />
            <Button onClick={addIngredient}>Legg til</Button>
          </div>
          <ul className="list-disc list-inside text-sm">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold">2. Spør kokkehjelperen</h2>
          <div className="space-y-2">
            <div className="border rounded-md p-2 h-48 overflow-y-auto bg-gray-50">
              {chatLog.map((entry, idx) => (
                <p key={idx} className="text-sm">
                  <strong>{entry.sender}:</strong> {entry.text}
                </p>
              ))}
              {loading && <p className="text-sm italic">Kokkehjelperen skriver...</p>}
            </div>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Spør om fremgangsmåte, erstatninger..."
              />
              <Button onClick={handleChat} disabled={loading}>Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
