import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmailConfirmed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Thank You!</h1>
        <p className="text-gray-600">
          Your email has been confirmed successfully. You can now return to the
          expense tracker app.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full"
        >
          Go to Expense Tracker
        </Button>
      </div>
    </div>
  );
};

export default EmailConfirmed;