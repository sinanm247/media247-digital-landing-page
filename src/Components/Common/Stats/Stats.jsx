import "./Stats.scss"
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaCalendarAlt, FaCheckCircle, FaBriefcase } from 'react-icons/fa';

const stats = [
    {
        id: 1,
        icon: FaUsers,
        number: 10000,
        label: "Happy Clients",
        showPlus: true,
        showK: true,
    },
    {
        id: 2,
        icon: FaCalendarAlt,
        number: 20,
        label: "Years of Experiences",
        showPlus: true,
        showK: false,
    },
    {
        id: 3,
        icon: FaCheckCircle,
        number: 98,
        label: "Satisfied Clients",
        showPlus: false,
        showK: false,
        showPercent: true,
    },
    {
        id: 4,
        icon: FaBriefcase,
        number: 1200,
        label: "Businesses Helped",
        showPlus: true,
        showK: false,
    },
]

export default function Stats() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const formatNumber = (number, showK, showPercent) => {
        if (showPercent) {
            return number;
        }
        if (showK && number >= 1000) {
            return (number / 1000).toFixed(0);
        }
        return number;
    };

    return (
        <section className="stats-section">
            <div className="section-container">
                <div className="stats-wrapper">
                    <div className="stats-content">
                        <h2 className="section-title">Delivering Paramount Service to Every Client</h2>
                        <p className="section-description">
                            We ensure each client receives the highest potential returns and advantages through our dedicated service and expert advice. Use our mortgage calculator Dubai to get started today.
                        </p>
                    </div>
                    <div ref={ref} className="stats-grid">
                        {stats.map((stat) => {
                            const IconComponent = stat.icon;
                            const displayNumber = formatNumber(stat.number, stat.showK, stat.showPercent);
                            return (
                                <div key={stat.id} className="stat-item">
                                    {/* <div className="stat-icon">
                                        <IconComponent />
                                    </div> */}
                                    <div className="stat-content">
                                        <div className="stat-number">
                                            {inView && <CountUp end={displayNumber} duration={2.5} />}
                                            {stat.showK && 'K'}
                                            {stat.showPercent && '%'}
                                            {stat.showPlus && !stat.showPercent && '+'}
                                        </div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}