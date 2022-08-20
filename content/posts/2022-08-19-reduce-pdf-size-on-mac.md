---
title: Reduce PDF size on a Mac
tags: journal
---
You can use the Mac Preview app to reduce the size of any PDF file. The default steps are

1. Open the PDF with the Preview app
2. Select **File -> Export…** (do not choose *Export as PDF*)
3. Select the format, which is **PDF**
4. Choose the **Quartz filter** named **Reduce File Size**
5. **Save**

It might happen that the quality of scanned images in the resulting PDF is not good enough. In this case you can create your own Quartz filter.^[Credit for showing this goes to *Living Image.* Watch on YouTube: [<cite>How to Reduce PDF File Size on Mac Without Loosing Quality</cite>](https://youtu.be/Coxh2OJ9_lE)] 


1. Open the **ColorSync Utility**, you can search for it with your Spotlight search. 
2. Switch to **Filters**
3. Add a filter by clicking on the **+** symbol in the lower left corner
4. Give your new filter a name, e.g. **Reduce PDF Size**
5. Go to the settings of the filter by clicking on the gear symbol ⚙
6. Choose **Add Image Effects Component -> Image Compression**
7. Change the mode to **JPEG** and adjust the **Quality** slider to something like 40% (by default it is on 50% for the new filter).

Once you created this custom filter, you can again switch to the Preview app, choose **File -> Export…**, select your new filter **Reduce PDF Size** and **Save** your PDF. This should reduce the PDF size while maintaining acceptable quality.