# ScriptableBartWidget
A script that can be run within the Scriptable app to display a widget showing the next few trains departing from any bart station.

## Install
- Install the Scriptable app via the App Store: https://apps.apple.com/us/app/scriptable/id1405459188
- Move the "Bart widget.js" file from this repo onto your phone in your favorite manner
- Edit the configuration (if needed)
- Long press on your home screen to add the "Scriptable" widget
- While still in the "editing" mode on your home screen, tap the scriptable app
- Select "Bart Widget" as the source script
- Optionally, you can configure the station and direction here
- - Station abbreviations are here: https://api.bart.gov/docs/overview/abbrev.aspx
  - Direction can be n or s
  - No quotes are needed around this text
  - Example: BALB,s
  - Example: MLBR,n
- Tap out of the Scriptable editing popup
- **IMPORTANT** hit _done_ to save the changes. If you just tap the home screen, iOS discards changes.

## Screenshots
"Small" sized widget
![small widget](https://github.com/alvarezb/ScriptableBartWidget/blob/main/WidgetExample.jpeg?raw=true)


## Config options
- `api` If you have an API key from https://api.bart.gov/api/register.aspx, you can add it here! If not, the script will use the shared API key that bart publishes, but which rotates periodically and will then stop working.
- `shared_api` The public API key that bart displays on https://www.bart.gov/schedules/developers/api. This might change in the future, so if the API gives you invalid key errors you can either sign up for your own key, or replace this with the new key on bart's website.
- `start_station` This is the station that will be used to get the departure ETAs.
- `dir` Either "n" or "s" for northbound and southbound.
- `allowed_lines` if you want to hide train lines from your list, remove them from this array!
- `num_trains` I've found that 4 trains fit on a standard "small" widget. If you change other things in the code, you might want to change this also.


## Updates
If you have any suggestions or if you make the widget more attractive, please create a pull request!
