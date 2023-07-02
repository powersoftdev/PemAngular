export class State {
  companyId?: string;
  divisionId?: string;
  departmentId: string;
  nationalityId:string
  stateId:string;
  stateDescription: string;
  lockedBy?: string;
  lockTs?: string;
  branchCode?: any;
  data:string;
  status:string;
}

// export interface StateResponse {
//   states: State []
// }
