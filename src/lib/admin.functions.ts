import { supabase } from "@/integrations/supabase/client";

export const requireAdmin = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (error || !isAdmin) {
    throw new Error("Forbidden");
  }

  return { isAdmin: true };
};
