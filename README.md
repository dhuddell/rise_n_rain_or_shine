#RISE AND RAIN OR SHINE

https://github.com/dhuddell/weather_back_end

Deployed App: http://dhuddell.github.io/weather_front_end

Full Stack Web Application
Weather-based-music-selection alarm clock

## USER STORIES
###Achieved:

**Given** I’m a first time user on the splash page, I **want** to register with **purpose** to be a create a unique id.

     # HTML holds form with email input, pw input, pw confirm, and submit button

**Given** I’ve completed registration, I **want** to login with **purpose** to interact securely with the web app.

     # HTML holds form with email input, pw input, and submit_(login?)_ button. **(DISPLAY ALARM BUTTONS)**

**Given** I’ve logged in for the FIRST TIME, I **want** to customize my profile **purpose** to keep useful info on my profile. 

     # In-depth profile with nickname, location, and then music preferences

**Given** I’ve filled my in-depth profile, I **want** to set an alarm **purpose** to be sure I’ll be woken up

     # Get time, set wake_up_time

**Given** I have set an alarm, I** want**  to cancel that alarm **purpose** I don’t need it anymore

     # Hit button to clear alarm

**Given** I have created a profile, I **want** to update that profile **purpose** I moved to a new city

    # Use READ and UPDATE to display and then change a profile

**Given** I have created a profile, I **want** to destroy that profile **purpose** I hate Dan Huddell

    # Use DELETE to destroy the current profile

**Given** I have created a profile, I **want** to see local weather **purpose** to know the weather.

    # Change zip code into Lat/Lng (GoogleMapsAPI), use Lat/Lng with ForecastIO_API to return current weather



###In Progress:

**Given** I’m a first time user, I **want** a splash/landing page with **purpose** to introduce the web app.

    # HTML includes landing page with css animation + fun

**Given** I’m a first time user on the splash page, I **want** to register AND login(at once) **purpose** to be a unique id and interact securely.

    # Button runs register + login

**Given** the time for my alarm arrives, I **want** MY weather-based music **purpose** to make me happy

    # Get time, compare to wake_up_time, find local weather info, use tags to choose song, play song

**Given** I hear my alarm, I **want** to turn off the song **purpose** I’m now awake and don’t need music

    # Add dismiss button to end song and just display time 

## Navigation flow

- Register (user creation)

- Login (auth)

- Profile creation

- Weather pairs creation

- Set Alarm

- *WAIT*

- Find weather (1min before alarm use some weather API go get up-to-date weather info)

- Play song (weather is assigned value, tag/weather pairs exist in db, find tag that matches user selections, fetch song with tag) 
