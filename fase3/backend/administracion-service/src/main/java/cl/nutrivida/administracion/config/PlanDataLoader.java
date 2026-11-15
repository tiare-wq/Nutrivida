package cl.nutrivida.administracion.config;

import cl.nutrivida.administracion.entity.Plan;
import cl.nutrivida.administracion.repository.PlanRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PlanDataLoader implements CommandLineRunner {

    private final PlanRepository planRepository;

    public PlanDataLoader(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public void run(String... args) {

        List<Plan> planes = List.of(

            new Plan(
                "P1",
                "Plan de pérdida de peso (1 mes)",
                "Programa de un mes orientado a la pérdida de peso, con seguimiento nutricional y un plan de alimentación personalizado.",
                "clinico",
                "1 mes",
                "Presencial",
                new BigDecimal("65000")
            ),

            new Plan(
                "P2",
                "Plan de pérdida de peso (3 meses)",
                "Programa de tres meses para la pérdida de peso, con controles periódicos, planes de alimentación y seguimiento continuo.",
                "clinico",
                "3 meses",
                "Presencial",
                new BigDecimal("170000")
            ),

            new Plan(
                "P3",
                "Plan de nutrición deportiva (1 mes)",
                "Plan nutricional dirigido a deportistas y personas con actividad física frecuente, adaptado a sus requerimientos energéticos y proteicos.",
                "deportivo",
                "1 mes",
                "Presencial",
                new BigDecimal("70000")
            ),

            new Plan(
                "P4",
                "Plan control diabetes / hipertensión",
                "Plan de alimentación adaptado a personas con diabetes o hipertensión, considerando sus necesidades nutricionales y objetivos de salud.",
                "clinico",
                "1 mes",
                "Presencial",
                new BigDecimal("75000")
            ),

            new Plan(
                "P5",
                "Plan alimentación vegetariana / vegana",
                "Plan alimenticio adaptado a una alimentación vegetariana o vegana, considerando el aporte adecuado de nutrientes esenciales.",
                "veg",
                "1 mes",
                "Presencial",
                new BigDecimal("68000")
            ),

            new Plan(
                "P6",
                "Plan alimentación infantil (2 - 12 años)",
                "Plan alimenticio adaptado a niños entre 2 a 12 años de edad.",
                "clinico",
                "1 mes",
                "Presencial",
                new BigDecimal("60000")
            )
        );

        for (Plan plan : planes) {
            if (!planRepository.existsById(plan.getId())) {
                planRepository.save(plan);
            }
        }
    }
}