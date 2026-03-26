"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function SubscribeButton({
    text = "Commencer mon parcours",
    className = "",
    variant = "default"
}: {
    text?: string,
    className?: string,
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}) {
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/checkout", {
                method: "POST",
            });

            if (!response.ok) {
                // If 401, redirect to login
                if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                throw new Error("Something went wrong");
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.log("PAYMENT_ERROR", error);
            toast.error("Une erreur est survenue lors de la redirection vers Stripe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className={className}
            variant={variant}
            onClick={onSubscribe}
            disabled={loading}
        >
            {loading ? "Redirection..." : text}
        </Button>
    );
}
