import { AlertLevel } from 'app/enums/alert-level.enum';
import { ApiTimestamp } from 'app/interfaces/api-date.interface';

export interface Alert {
  args: string;
  datetime: ApiTimestamp;
  dismissed: boolean;
  formatted: string;
  id: string;
  key: string;
  klass: string;
  last_occurrence: ApiTimestamp;
  level: AlertLevel;
  mail: string;
  node: string;
  one_shot: boolean;
  source: string;
  text: string;
  uuid: string;
}

export interface AlertCategory {
  id: string;
  title: string;
  classes: AlertClass[];
}

export interface AlertClass {
  id: string;
  level: AlertLevel;
  title: string;
}

export interface AlertClasses {
  id: number;
  classes: {
    [className: string]: { level: AlertClasses };
  };
}

export type AlertClassesUpdate = Omit<AlertClasses, 'id'>;
