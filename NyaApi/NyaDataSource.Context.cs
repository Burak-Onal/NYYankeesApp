﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NyaApi
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class nya_exampleEntities : DbContext
    {
        public nya_exampleEntities()
            : base("name=nya_exampleEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<bstatsplayersseasonsbyteam> bstatsplayersseasonsbyteams { get; set; }
        public virtual DbSet<level> levels { get; set; }
        public virtual DbSet<player> players { get; set; }
        public virtual DbSet<pstatsplayersseasonsbyteam> pstatsplayersseasonsbyteams { get; set; }
        public virtual DbSet<team> teams { get; set; }
    }
}