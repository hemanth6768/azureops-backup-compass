import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to: string;
  label?: string;
}

const BackButton = ({ to, label = "Back to Dashboard" }: BackButtonProps) => {
  return (
    <Button asChild variant="outline" size="sm" className="ml-auto">
      <Link to={to} aria-label={`Back: ${label}`}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
};

export default BackButton;
