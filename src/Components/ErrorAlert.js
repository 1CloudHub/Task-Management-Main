import { toast } from "react-toastify";

export const ErrorAlert = (response) => {
  response.error && (
    <>
      toast.error(response.error); console.error(`Error in `, response.error &&
      response.error);
    </>
  );
};
