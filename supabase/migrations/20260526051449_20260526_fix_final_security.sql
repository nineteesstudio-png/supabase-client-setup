/*
  # Final Security Fix - Revoke All Public Permissions

  1. Issue
    - get_signal_performance_stats still has PUBLIC execute permission
    - Need to explicitly revoke from PUBLIC before granting to specific roles
  
  2. Fix
    - Revoke ALL from PUBLIC on both functions
    - Explicitly grant only to authenticated role
*/

-- Revoke all permissions from PUBLIC on get_signal_performance_stats
REVOKE ALL ON FUNCTION get_signal_performance_stats(uuid, text, integer) FROM PUBLIC;

-- Ensure only authenticated users can execute
REVOKE ALL ON FUNCTION get_signal_performance_stats(uuid, text, integer) FROM anon;
GRANT EXECUTE ON FUNCTION get_signal_performance_stats(uuid, text, integer) TO authenticated;

-- Also ensure close_expired_signals has no public access
REVOKE ALL ON FUNCTION close_expired_signals() FROM PUBLIC;

-- Verify permissions are correct
DO $$
DECLARE
    public_count integer;
    anon_count integer;
BEGIN
    SELECT COUNT(*) INTO public_count
    FROM information_schema.routine_privileges
    WHERE routine_name = 'get_signal_performance_stats' 
    AND grantee = 'PUBLIC';
    
    SELECT COUNT(*) INTO anon_count
    FROM information_schema.routine_privileges
    WHERE routine_name = 'get_signal_performance_stats' 
    AND grantee = 'anon';
    
    IF public_count > 0 OR anon_count > 0 THEN
        RAISE EXCEPTION 'Security issue: PUBLIC or anon still has execute permission on get_signal_performance_stats';
    END IF;
END $$;