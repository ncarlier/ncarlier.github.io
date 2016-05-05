# <%= name %>

> <%= description %>

## About me

age: <%= age %> | xp: <%= year_of_xp %> | company: <%= company %> | location: <%= location %>

<%= about %>
<% for(var index in links) { %><% var link = links[index]; %>
- [<%= link.label %>](<%= link.url %>)
<% } %>

## My skills

<% for (var cat in skills) { %>
- <%= cat %>
<% for (var skill in skills[cat]) { %>  + <%= skill %>
<% } %>
<% } %>

## Experiences

<% var years = Object.keys( experiences); %>
<% for(var i = years.length; i > 0; i--) { %>
<% var year = years[i-1]; %>
### <%= year %>
<% for (var x in experiences[year]) { %>
<% var xp = experiences[year][x] %>
- <%- xp.desc %><% if (xp.tags) { %>  *<%= xp.tags.join(", ")%>*<% } %>

<% } %>
<% } %>

## Education

<% for(var index in education) { %>
<% var graduation = education[index]; %>
**<%= graduation.title %>**
*<%= graduation.location %>* (<%= graduation.years %>)
<% } %>

------------------------------------------------------------------------------
