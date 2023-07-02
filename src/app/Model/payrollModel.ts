export class PayrollModel {
    companyId: string;
    divisionId: string;
    departmentId: string;
    payTypeId: string;
    payTypeDescription: string;
    glaccountNumber: string;
    attrDescription: string;
    operatorId: string;
    conversionFactor: number;
    totalAmount: string;
    lockedBy: string;
    lockTs: Date;
    statusId: string;
    payTypeDefault: boolean;
    employeePercent: number;
    zerorise: boolean;
    sortOrder: number;
    accrued: boolean;
    employerPercent: number;
    payTypeGlaccountNumber: string;
    taxable: boolean;
    glaccountNumber1: string;
    prorate: boolean;
    ignoreHourlyRate: boolean;
    billingItem: boolean;
    showBalanceOnSlip: boolean;
    branchCode: string;
    paymentTypesDetail : any[]
  }   
  

  

  export class  paymentTypesDetail
  {
    companyId: string;
    divisionId: string;
    departmentId: string;
    payTypeId: string;
    payTypeDetailId: string;
    payTypeDetailInc:0;
    employeePercent?: any;
    employerPercent?: any;
    operatorId?: any;
    active: boolean;
    lockedBy?: any;
    lockTs?: any;
    branchCode?: any;
  }