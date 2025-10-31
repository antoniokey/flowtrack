import { createContext, useContext } from 'react';

interface IFlowtrackRouterContext {
  push: (url: string) => void;
  replace?: (url: string) => void;
  back?: () => void;
  pathname?: string;
  query?: Record<string, any>;
}

const FlowtrackRouterContext = createContext<IFlowtrackRouterContext | null>(null);

export const FlowtrackRouterProvider = FlowtrackRouterContext.Provider;

export const useFlowtrackRouter = (): IFlowtrackRouterContext => useContext(FlowtrackRouterContext) as IFlowtrackRouterContext;
