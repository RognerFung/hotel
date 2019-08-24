# hotel
hotel data cleaning

Website: 

http://ec2-13-250-179-182.ap-southeast-1.compute.amazonaws.com:3000/

Backend Code: 

https://github.com/RognerFung/hotel

UI Code:

https://github.com/RognerFung/hotel-ui

UI Flow:

1. Click Source A, Source B, Source C to load data from source. Data will be append together in the textarea in json format.
2. Click Clean button to send data to backend to process, return clean formating data as json format show in textarea in json format.
3. A search bar will appear when clean data is returned.
4. Input in the search bar will use hotel id or designation_id as key word to search in the clean data. 
5. Search result will dynamicly appear in the textarea.
6. Click Search button will show hotel names in the result.
7. A information label at the bottom will show status of process.

Backend business logic:

1. Input data is an array of source objects.
2. First process all sources into a temp format, with all correct key in the root level.
  2.1 All keys will adapt to correct name. e.g. Id, hotel_id -> id.
  2.2 Country code will change to country name. e.g. SG -> Singapore.
  2.3 Some field will change to lowercase e.g. WiFi -> wifi.
  2.4 Some field will change from alias to standard. e.g. BusinessCenter -> business center.
3. Merge all sources if they have same id.
  3.1 Some field longer version will replace shorter version. e.g. description.
  3.2 Some array field will append different item. e.g. amenities room facilities or images of different link.
4. Do address formating, remove country from the address and append postalcode in the end of the address.
  e.g. 160-0023, SHINJUKU-KU, 6-6-2 NISHI-SHINJUKU, JAPAN -> SHINJUKU-KU, 6-6-2 NISHI-SHINJUKU, 160-0023
5. Restructure the sources into final format.
