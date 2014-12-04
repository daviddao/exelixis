#!/usr/bin/env perl

use strict;
use warnings;
use Data::Dumper;
use JSON::PP;

use Bio::EnsEMBL::Registry;


use FindBin;
use lib $FindBin::Bin;
use TreeHash;

my $reg = "Bio::EnsEMBL::Registry";
$reg->load_registry_from_db (
			     -host => '127.0.0.1',
			     -port => 2902,
			     -user => 'ensro',
			     -verbose => 0,
			     -db_version => 75
			    );



my $tree_id = 'ENSGT00390000003602';

my $compara_dba = $reg->get_DBAdaptor("Multi", "compara");

my $genetree_adaptor = $compara_dba->get_GeneTreeAdaptor();

my $genetree = $genetree_adaptor->fetch_by_stable_id ($tree_id);


my $treehash = TreeHash->new();
$treehash->aligned(1);
$treehash->exon_boundaries(1);

my $hash = $treehash->convert($genetree);
my $json = JSON::PP->new();

$json->pretty(0);
my $str = $json->encode($hash);
print "$str\n";

