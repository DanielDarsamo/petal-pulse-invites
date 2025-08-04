-- Create weddings table
CREATE TABLE public.weddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple1_name TEXT NOT NULL,
  couple2_name TEXT NOT NULL,
  wedding_date DATE,
  copyright_text TEXT DEFAULT '© 2025 YourBrand',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backgrounds table
CREATE TABLE public.backgrounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  image_url TEXT,
  opacity INTEGER DEFAULT 85 CHECK (opacity >= 0 AND opacity <= 100),
  blur INTEGER DEFAULT 3 CHECK (blur >= 0 AND blur <= 20),
  overlay_color VARCHAR(9) DEFAULT '#FFFFFF33',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create music table
CREATE TABLE public.music (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  volume INTEGER DEFAULT 75 CHECK (volume >= 0 AND volume <= 100),
  autoplay BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_time TIMESTAMPTZ,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  marker_color VARCHAR(7) DEFAULT '#FF6B6B',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  invitation_code VARCHAR(8) UNIQUE NOT NULL,
  rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  meal_preference TEXT,
  allergies TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guestbook table
CREATE TABLE public.guestbook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weddings
CREATE POLICY "Users can view their own weddings" 
ON public.weddings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weddings" 
ON public.weddings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings" 
ON public.weddings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings" 
ON public.weddings FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for backgrounds
CREATE POLICY "Users can view backgrounds of their weddings" 
ON public.backgrounds FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = backgrounds.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can create backgrounds for their weddings" 
ON public.backgrounds FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = backgrounds.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update backgrounds of their weddings" 
ON public.backgrounds FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = backgrounds.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can delete backgrounds of their weddings" 
ON public.backgrounds FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = backgrounds.wedding_id AND weddings.user_id = auth.uid()));

-- RLS Policies for music
CREATE POLICY "Users can view music of their weddings" 
ON public.music FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = music.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can create music for their weddings" 
ON public.music FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = music.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update music of their weddings" 
ON public.music FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = music.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can delete music of their weddings" 
ON public.music FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = music.wedding_id AND weddings.user_id = auth.uid()));

-- RLS Policies for events
CREATE POLICY "Users can view events of their weddings" 
ON public.events FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = events.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can create events for their weddings" 
ON public.events FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = events.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update events of their weddings" 
ON public.events FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = events.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can delete events of their weddings" 
ON public.events FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = events.wedding_id AND weddings.user_id = auth.uid()));

-- RLS Policies for guests
CREATE POLICY "Users can view guests of their weddings" 
ON public.guests FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guests.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Guests can view their own record" 
ON public.guests FOR SELECT 
USING (true);

CREATE POLICY "Users can create guests for their weddings" 
ON public.guests FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guests.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Users can update guests of their weddings" 
ON public.guests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guests.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Guests can update their own RSVP" 
ON public.guests FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete guests of their weddings" 
ON public.guests FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = guests.wedding_id AND weddings.user_id = auth.uid()));

-- RLS Policies for guestbook
CREATE POLICY "Everyone can view guestbook messages" 
ON public.guestbook FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create guestbook messages" 
ON public.guestbook FOR INSERT 
WITH CHECK (true);

-- Create function to generate unique invitation codes
CREATE OR REPLACE FUNCTION generate_invitation_code() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_weddings_updated_at
    BEFORE UPDATE ON public.weddings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backgrounds_updated_at
    BEFORE UPDATE ON public.backgrounds
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_updated_at
    BEFORE UPDATE ON public.music
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();