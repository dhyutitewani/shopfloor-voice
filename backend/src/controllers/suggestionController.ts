import { Request, Response } from "express";
import Suggestion from "../models/suggestion";

interface SuggestionData {
  suggestion: string;
  category: string;
  employeeId?: string;
}

const validateSuggestion = (suggestionData: SuggestionData): boolean => {
  const { suggestion, category } = suggestionData;
  return !!suggestion && !!category;
};

const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const generateHash = async (): Promise<string> => {
  const latestSuggestion = await Suggestion.findOne().sort({ createdAt: -1 }).exec();
  const latestHash = latestSuggestion?.hash;

  if (latestHash) {
    const hashNumber = parseInt(latestHash.slice(1)) + 1;
    return `A${hashNumber.toString().padStart(3, '0')}`;
  } else {
    return 'A001';
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const createSuggestion = async (req: Request, res: Response) => {
  console.log(req.body)
  const { suggestion, employeeId, category } = req.body as SuggestionData;

  if (!validateSuggestion(req.body)) {
    return res.status(400).json({ message: "Suggestion and Category are required." });
  }

  try {
    const currentDate = new Date();
    const formattedDate = formatDateTime(currentDate); 

    const hash = await generateHash(); 

    const newSuggestion = new Suggestion({
      hash,  
      category,
      suggestion,
      dateTime: formattedDate,  
      employeeId: employeeId || "Anonymous",  
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (err) {
    res.status(500).json({ message: "Failed to save suggestion", error: (err as Error).message });
  }
};