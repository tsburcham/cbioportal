/*
 *  Copyright (c) 2014 Memorial Sloan-Kettering Cancer Center.
 * 
 *  This library is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF
 *  MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  The software and
 *  documentation provided hereunder is on an "as is" basis, and
 *  Memorial Sloan-Kettering Cancer Center 
 *  has no obligations to provide maintenance, support,
 *  updates, enhancements or modifications.  In no event shall
 *  Memorial Sloan-Kettering Cancer Center
 *  be liable to any party for direct, indirect, special,
 *  incidental or consequential damages, including lost profits, arising
 *  out of the use of this software and its documentation, even if
 *  Memorial Sloan-Kettering Cancer Center 
 *  has been advised of the possibility of such damage.
 */
package org.mskcc.cbio.importer.persistence.staging;

import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSortedMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import java.util.List;
import java.util.Map;

/**
 * represents a collection of common values used throughout the importer
 * module
 * @author criscuof
 */
public interface StagingCommonNames {

    public static final String HUGO_COLUMNNAME = "Hugo_symbol";
    public static final String CNV_FILENAME = "data_CNA.txt";
    public static final String MUTATIONS_FILENAME = "data_mutations_extended.txt";
    public static final String CASE_STUDY_FILENAME = "data_case_study.txt";
    public static final String segmentFileBaseName = "_data_cna_hg.seg";

    public static final List<String> variationList = Lists.newArrayList("INS", "SNP", "DNP", "TNP", "ONP");

    public static final Splitter tabSplitter = Splitter.on("\t");
    public static final Splitter lineSplitter = Splitter.on("\n").trimResults();
    public static final Splitter blankSplitter = Splitter.on(" ");
    public static final Splitter scSplitter = Splitter.on(";");
    public static final Joiner scJoiner = Joiner.on(";");
    public static final Joiner tabJoiner = Joiner.on('\t').useForNull(" ");
    public static final Joiner commaJoiner = Joiner.on(',').useForNull(" ");
    public static final Joiner blankJoiner = Joiner.on(" ");
    public static final Splitter posSplitter = Splitter.on(':');
    public final Joiner pathJoiner =
            Joiner.on(System.getProperty("file.separator"));
    public final Splitter pathSplitter =
            Splitter.on(System.getProperty("file.separator"));

    // length of human chromosomes
    // http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/
    public static final ImmutableMap<String, Long> chromosomeLengthMap = new ImmutableMap.Builder<String, Long>()
            .put("1", Long.valueOf(248_956_422))
                    .put("2", Long.valueOf(242_193_529))
                    .put("3", Long.valueOf(198_295_559))
                    .put("4", Long.valueOf(190_214_555))
                    .put("5", Long.valueOf(181_538_259))
                    .put("6", Long.valueOf(170_805_979))
                    .put("7", Long.valueOf(159_345_973))
                    .put("8", Long.valueOf(145_138_636))
                    .put("9", Long.valueOf(138_394_717))
                    .put("10", Long.valueOf(133_797_422))
                    .put("11", Long.valueOf(135_086_622))  // this is correct
                    .put("12", Long.valueOf(133_75_309))
                    .put("13", Long.valueOf(114_364_328))
                    .put("14", Long.valueOf(107_043_718))
                    .put("15", Long.valueOf(101_991_189))
                    .put("16", Long.valueOf(90_338_345))
                    .put("17", Long.valueOf(83_257_441))
                    .put("18", Long.valueOf(80_373_285))
                    .put("19", Long.valueOf(58_617_616))
                    .put("20", Long.valueOf(64_444_167))
                    .put("21", Long.valueOf(46_709_983))
                    .put("22", Long.valueOf(50_818_468))
                    .put("X", Long.valueOf(156_040_895))
                    .put("Y", Long.valueOf(57_227_415)).build();
}