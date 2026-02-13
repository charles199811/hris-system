import { Metadata } from "next"
import EmployeeWithRole from "./employee-with-role";

export const metadata: Metadata = {
  title: "Employee details",
};

const AllEmployeeWithRole = () => {
    return (<EmployeeWithRole/>
     );
}
 
export default AllEmployeeWithRole;