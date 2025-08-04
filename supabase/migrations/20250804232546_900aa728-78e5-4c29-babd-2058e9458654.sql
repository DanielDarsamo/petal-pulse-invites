-- Fix security warnings by setting proper search paths for functions
ALTER FUNCTION generate_invitation_code() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;