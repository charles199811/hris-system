import { Metadata } from "next"
import EmployeeData from "./employee-data";


export const metadata: Metadata = {
  title: "Employee details",
};

const EmployeePage = () => {
    return (<EmployeeData/>
      
     );
}
 
export default EmployeePage;