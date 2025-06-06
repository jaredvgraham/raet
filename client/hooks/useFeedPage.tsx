import { createContext, useContext, useState, ReactNode } from "react";

interface FeedPageContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const FeedPageContext = createContext<FeedPageContextType>({
  currentPage: "Rate",
  setCurrentPage: () => {},
});

export const useFeedPage = () => {
  return useContext(FeedPageContext);
};

export const FeedPageProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("Rate");

  return (
    <FeedPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </FeedPageContext.Provider>
  );
};
