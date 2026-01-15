'use client';

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#7c3aed' },
    subtitle: { fontSize: 14, color: '#6b7280', marginTop: 5 },
    section: { margin: 10, padding: 10 },
    sectionTitle: { fontSize: 18, marginBottom: 10, color: '#4b5563' },
    statRow: { flexDirection: 'row', marginBottom: 5 },
    statLabel: { width: 150, fontWeight: 'bold', color: '#374151' },
    statValue: { color: '#6b7280' },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#9ca3af', fontSize: 10 }
});

const MyDocument = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>TitanFit - Rapport Mensuel</Text>
                <Text style={styles.subtitle}>{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Résumé Global</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Entraînements :</Text>
                    <Text style={styles.statValue}>{data.workouts} séances</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Temps total :</Text>
                    <Text style={styles.statValue}>{data.duration} minutes</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Calories brûlées :</Text>
                    <Text style={styles.statValue}>{data.caloriesBurned} kcal</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutrition</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Moyenne Calories :</Text>
                    <Text style={styles.statValue}>{data.avgCalories} kcal/jour</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Protéines Moy. :</Text>
                    <Text style={styles.statValue}>{data.avgProtein} g/jour</Text>
                </View>
            </View>

            <Text style={styles.footer}>Généré par TitanFit V2 - Votre partenaire fitness ultime</Text>
        </Page>
    </Document>
);

export default function PDFExport({ data }: { data: any }) {
    return (
        <div className="mt-4">
            <PDFDownloadLink document={<MyDocument data={data} />} fileName="rapport-titanfit.pdf">
                {({ blob, url, loading, error }) => (
                    <Button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        {loading ? 'Génération du PDF...' : 'Télécharger le Rapport PDF'}
                    </Button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
