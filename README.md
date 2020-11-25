# Seiyuu Sauce
A [website](https://seiyuusauce.com/) allowing anime fans to quickly see the characters that a voice actor has voiced.
*Using the AniList GraphQL API.*
<dl>
  <dt>Seiyuu</dt>
  <dd>The Japanese term for a voice actor in an anime</dd>
  <dt>Sauce</dt>
  <dd>Internet slang for the word <em>source</em> ("Send me that picture's sauce!")</dd>
</dl>

---

### Basic Usage
The search menu allows for voice actor lookup via a character name or voice actor name. 
A character query is first sent, and if that fails, a voice actor query is sent. 
- Partial names can be used; however, in the case of matching names, first and last name will provide the best results. 
- Japanese name ordering (Last Name, First Name) is not required.
- Results are ordered by the character's popularity metric on AniList

![Screenshot of a basic voice actor search for Kana Hanazawa](basicExample.PNG)
Click on the various card elements to open the AniList page for the respective element.
### Options
Shows to List:
- Specifies the maximum number of shows/characters do display from the voice actor 
- Defaults to 25, which is the maximum due to Anilist's API Pagination

Romaji Names:
- Specifies if the show and character names are displayed in their English translated form, or their romanized English form
### Cross-Refrencing an AniList
The import menu allows for any user's AniList to be imported into the site. 
After the AniList has been imported, voice actor/character searches will first display characters from shows the user has seen before shows that have not been seen.
- These will be shown with a blue border, as opposed to the default red border.

![Screenshot of a cross-referenced voice actor search for Kana Hanazawa](listExample.PNG)
- Authentication is *not* required, so *any* user's account can be imported

### Data Caching
The last voice actor query, and last user list import will be saved to the browser cache allowing the site to resume where last left off when reopened. 
- If a user list is saved, it will take a second to load in

### Custom URLs
The site URL will be modified with ?search={name} upon a successful search. This custom URL can be copied and shared by clicking on the share button, or just by copying the current URL.
- If a userlist is cached, then the URL based query *will* cross-reference.

- Example: https://seiyuusauce.com/?search=Kana%20Hanazawa
---
### Common Issues
Voice Actor/Character Query Keeps Failing Desipte Correct Name:
- Romanized Japanese names do not have consistent spelling, check for letters such as *u* or *o* (Nao Toyama vs Nao To**u**yama)

The Page Isn't Showing All of The Shows/Characters:
- Try scrolling down, the cards will fade in 

A Show is Not Shown With The Proper Blue Border for 'Seen'
- Getting a userlist from the browser cache is based on a setTimeout function which results in JS timing issues when loading extremely long userlists
- Reset the page, reimport the AniList, and perform the search again 

### Future Feature Wishlist

Contributions are welcome! Feel free to submit a pull request or fork the repository!

- Reimplement queries to allow for display of more than 25 characters

- Visualization of how many characters of a voice actor a user has in their AniList

- Ability to add unseen shows to the plan to watch list via AniList authentication

- Ability to search for multiple voice actors to see shows that they have both been in

- Fix the timing issue with querying userlist from localStorage

---

### MIT License

Copyright (c) 2020 Gabriel Doon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

