export type NewBilling = {
  id: string;
  client: {
    id: string;
    name: string;
  }
  dos: string;
  clientDob: string;
  insurance: string;
  template: string;
  staff: string;
  staffNpi: string;
  site: string;
  serviceCode: string;
  units: number;
  rate: number;
  toBill: boolean;
  status: string;
}