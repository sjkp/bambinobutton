﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BalkanButton.Controllers;
using BalkanButton.Controllers.DTO;

namespace BalkanButton
{
    //[RoutePrefix("api/v1/youtubemusic")]
    [EnableCors("*", "*", "*")]
    public class LanguageController : ApiController
    {
        // GET api/<controller>
        public List<Language> Get()
        {
            using (var context = new BalkanButton.Models.bambino_dbEntities())
            {
                return context.song.Select(s => s.language).Distinct().ToList().Select(l => 
                    new Language { Name = new CultureInfo(l).DisplayName, LCID = l }
                    ).ToList();
            }
        }       
    }
}