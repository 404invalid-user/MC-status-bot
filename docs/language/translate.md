
# Translate language
## If you don't have a GitHub account

join the [support discord](https://www.mcstatusbot.site/discord?ref=translate-guide-docs) and @ an !invalid-user then i will walk you though doing it.

## If you have a GitHub account

first navigate to https://github.com/404invalid-user/MC-status-bot

once you are here click the fork button to fork the repository
![github repo](https://bisot.xyz/!invalid-user/mBBHRoLWa.png)
<br>


navigate to your repository then to languages now click on file called en.json to open it once it is open copy all of its content by clicking the button at the top of the file. 
![en.json file](https://bisot.xyz/!invalid-user/yOzHaXkZY.png)

navigate out of it by clucking the word "languages" in the path 
![path image](https://bisot.xyz/!invalid-user/zOlDkiErw.png)
<br>

make a new file by first clicking Add file then Create new file from  the drop down
![add file](https://bisot.xyz/!invalid-user/VLmRhgugI.png)
<br>


and then name it `(language iso).json` replacing (language iso) with the iso of your language from this website [https://www.loc.gov/standards/iso639-2/php/code_list.php](https://www.loc.gov/standards/iso639-2/php/code_list.php) 

I chose fr beading French for this example (I don't know French)

![name file](https://bisot.xyz/!invalid-user/QfOFNIxPQ.png)
<br>

now click next to the 1 under Edit new file and paste the text in
![c](https://bisot.xyz/!invalid-user/oUokmWPrW.png)
<br>

then replace all the words in the `"` next to `"iso":` with the same iso you put as the file name under that. you want to go to [https://emojipedia.org/flags/](https://emojipedia.org/flags/) and find the flag for your language then copy and paste it into the  `"` next to `"flag":` 

once you have done that you can now go down the list of words adding your translation for them in the empty `"` next to them

once you have done all that scroll right to the bottom and click Commit new file
![Commit new file](https://bisot.xyz/!invalid-user/oassooDjW.png)

<br>



once you have done that you need to add the new language to the list in the documents got to docs/language/list.md in your repository and click the pencil to edit it 
![llist.md](https://bisot.xyz/!invalid-user/KqXzbVygp.png) 


you want to select the last language in the list like so then copy it **underneath** the last one
change their flag, iso and username to yours (make sure you keep the correct spacing)
![select](https://bisot.xyz/!invalid-user/TGOfJJllq.png)

once you have done all that scroll right to the bottom and click Commit new file then make a new pull request by going to [https://github.com/404invalid-user/MC-status-bot/pulls](https://github.com/404invalid-user/MC-status-bot/pulls) and open a new request by clicking New pull request 
![new pr](https://bisot.xyz/!invalid-user/QltdYQuGx.png)

once you have done that it should automatically detect your changes and look something like this
![pr](https://bisot.xyz/!invalid-user/NcSeigzMD.png)

make sure base repository is set to `404invalid-user/MC-status-bot` by clicking it and selecting it from the dropdown

once you have verified that click create pull request.
I will then check it and merge it 