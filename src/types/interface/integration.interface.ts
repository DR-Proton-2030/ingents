import { IIntegrationCardProps } from "./props/integrationCard.props";

export interface IntegrationWithStatus extends IIntegrationCardProps {
  isConnected: boolean;
  connectionData?: {
    name: string;
    project_id: string | null;
  };
}
