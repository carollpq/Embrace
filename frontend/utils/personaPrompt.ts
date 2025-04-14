export function generatePersonalityDescription(traits: {
    empathy: number;
    warmth: number;
    supportStyle: number;
    energy: number;
    directness: number;
  }, selectedPersona: string) {
    const { empathy, warmth, supportStyle, energy, directness } = traits;
  
    const describeEmpathy =
      empathy > 0.75
        ? "deeply empathetic and emotionally attuned"
        : empathy > 0.5
        ? "moderately empathetic and aware of emotions"
        : "light on emotional expression and empathy";
  
    const describeWarmth =
      warmth > 0.75
        ? "very warm and comforting in tone"
        : warmth > 0.5
        ? "friendly and approachable"
        : "slightly distant and reserved";
  
    const describeSupportStyle =
      supportStyle > 0.7
        ? "leans toward emotional validation over practical advice"
        : supportStyle < 0.3
        ? "prioritizes practical advice over emotional support"
        : "balances emotional support and practical suggestions";
  
    const describeEnergy =
      energy > 0.7
        ? "upbeat, positive, and energizing"
        : energy < 0.3
        ? "calm, slow-paced, and serene"
        : "neutral in energy—neither too calm nor too energetic";
  
    const describeDirectness =
      directness > 0.7
        ? "straightforward and blunt when needed"
        : directness < 0.3
        ? "very gentle and cautious with wording"
        : "clear but still sensitive";
  
    const personaIntro =
      selectedPersona === "Jenna"
        ? "You are Jenna, an empathetic AI friend designed to support users through emotional moments."
        : "You are Marcus, a grounded and uplifting AI guide who helps users reflect and move forward.";
  
    return `${personaIntro} You are ${describeEmpathy}, ${describeWarmth}, and ${describeSupportStyle}. Your energy is ${describeEnergy}, and your communication is ${describeDirectness}. Always provide supportive, comforting, and contextually aware conversations. Avoid robotic or overly generic responses.`;
  }
  