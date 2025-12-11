CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: calendar_doors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_doors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    calendar_id uuid NOT NULL,
    day_number integer NOT NULL,
    content_text text,
    content_image_url text,
    content_link text,
    background_color text DEFAULT '#dc2626'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT calendar_doors_day_number_check CHECK (((day_number >= 1) AND (day_number <= 24)))
);


--
-- Name: calendars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT 'My Advent Calendar'::text NOT NULL,
    description text,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    edit_token text DEFAULT encode(extensions.gen_random_bytes(16), 'hex'::text) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: calendar_doors calendar_doors_calendar_id_day_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_doors
    ADD CONSTRAINT calendar_doors_calendar_id_day_number_key UNIQUE (calendar_id, day_number);


--
-- Name: calendar_doors calendar_doors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_doors
    ADD CONSTRAINT calendar_doors_pkey PRIMARY KEY (id);


--
-- Name: calendars calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_pkey PRIMARY KEY (id);


--
-- Name: idx_calendar_doors_calendar_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendar_doors_calendar_id ON public.calendar_doors USING btree (calendar_id);


--
-- Name: idx_calendars_edit_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendars_edit_token ON public.calendars USING btree (edit_token);


--
-- Name: calendar_doors update_calendar_doors_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_calendar_doors_updated_at BEFORE UPDATE ON public.calendar_doors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: calendars update_calendars_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_calendars_updated_at BEFORE UPDATE ON public.calendars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: calendar_doors calendar_doors_calendar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_doors
    ADD CONSTRAINT calendar_doors_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id) ON DELETE CASCADE;


--
-- Name: calendars Anyone can create calendars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create calendars" ON public.calendars FOR INSERT WITH CHECK (true);


--
-- Name: calendar_doors Anyone can insert doors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert doors" ON public.calendar_doors FOR INSERT WITH CHECK (true);


--
-- Name: calendars Anyone can update calendars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update calendars" ON public.calendars FOR UPDATE USING (true);


--
-- Name: calendar_doors Anyone can update doors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update doors" ON public.calendar_doors FOR UPDATE USING (true);


--
-- Name: calendar_doors Calendar doors are publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Calendar doors are publicly viewable" ON public.calendar_doors FOR SELECT USING (true);


--
-- Name: calendars Calendars are publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Calendars are publicly viewable" ON public.calendars FOR SELECT USING (true);


--
-- Name: calendar_doors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.calendar_doors ENABLE ROW LEVEL SECURITY;

--
-- Name: calendars; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


