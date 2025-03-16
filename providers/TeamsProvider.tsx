"use client";

import { createContext, useContext, useState } from "react";
import { Prisma } from "@prisma/client";

type TeamWithTeamUsers = Prisma.TeamGetPayload<{
  include: {
    TeamUser: true;
  };
}>;

type TeamsContextType = {
  teams: TeamWithTeamUsers[];
  currentTeamID: number
  setCurrentTeamID: (id: number) => void
  addTeam: (team: TeamWithTeamUsers) => void
};

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider = ({
  children,
  currentTeam,
  initialTeams,
}: {
  children: React.ReactNode;
  currentTeam: number
  initialTeams: TeamWithTeamUsers[];
}) => {
  const [teams, setTeams] = useState<TeamWithTeamUsers[]>(initialTeams);
  const [currentTeamID, setCurrentTeamID] = useState(currentTeam)

  const addTeam = (team: TeamWithTeamUsers) => {
    setTeams(prevTeams => [team, ...prevTeams])
  }

  return (
    <TeamsContext.Provider value={{ teams, addTeam, currentTeamID, setCurrentTeamID }}>{children}</TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};
