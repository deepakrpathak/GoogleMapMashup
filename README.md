Google Map Mashup
-----------------------

Installation
----------------

Download, unzip and run index.html
You may push it local or web instance as well. You might want to use your own Google API key.


Use Cases
----------------
1. Locates client on map using HTML5 geolocation API
	1.1 If user denies, or for any other issue, it falls back and asks for location to be typed instead.
2. Asks User for its destination
3. Show driving directions on the map and on a direction panel which can be made hidden, if not reqired.


Known Issues
----------------

1. Firefox sometimes takes a long to fallback if user denies to share location.


TODO
----------------

1. Make the JS more compact and optimized. A little Object Orientation won't hurt.
2. Make it wrk on IE by working around the z-index problem. Any help will be appreciated.
3. Fix a problem of 'Total distance' div. It shows up when user toggles the on/off button after hitting 'Get Direction' with blank input. 
4. Extend the app 
	3.1 Try Autocompletion of text fields 
	3.2 For mobile 
	3.3 For metro Windows 8 app. If done, will look real cool.
5. Give the user an option to call the destination form back so that they need not reload the page if they want another place to go.
	



