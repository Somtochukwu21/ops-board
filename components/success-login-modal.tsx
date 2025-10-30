"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

interface ISignUpSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignUpSuccessModal({
  open,
  onOpenChange,
}: ISignUpSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Check your email</DialogTitle>
          <DialogDescription>
            We&apos;ve sent you a confirmation link to verify your email
            address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the confirmation link to complete
            your signup. Once confirmed, you can log in to your account.
          </p>
        </div>

        <DialogFooter>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
